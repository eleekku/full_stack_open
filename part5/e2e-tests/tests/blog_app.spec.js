const { test, expect, beforeEach, describe } = require('@playwright/test')

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.getByText(`${title} ${author}`)).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Taina Testaaja',
        username: 'ttestaaj',
        password: 'salasana'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'log in' })
    await expect(loginButton).toBeVisible()

    await loginButton.click()

    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByLabel('username').fill('ttestaaj')
      await page.getByLabel('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Taina Testaaja logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByLabel('username').fill('ttestaaj')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Taina Testaaja logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByLabel('username').fill('ttestaaj')
      await page.getByLabel('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Taina Testaaja logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Testi blogi')
      await page.getByPlaceholder('author').fill('Testaaja')
      await page.getByPlaceholder('url').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Testi blogi Testaaja')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByPlaceholder('title').fill('Testi blogi')
        await page.getByPlaceholder('author').fill('Testaaja')
        await page.getByPlaceholder('url').fill('http://testblog.com')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText('Testi blogi Testaaja')).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('the user who added the blog can delete it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Testi blogi Testaaja')).not.toBeVisible()
      })

      test('blogs are ordered by likes, most likes first', async ({ page }) => {
        await createBlog(page, 'Blogi A', 'Testaaja A', 'http://google.com')
        await createBlog(page, 'Blogi B', 'Testaaja B', 'http://example.com')

        const blogA = page.locator('.blog', { hasText: 'Blogi A Testaaja A' })
        await blogA.getByRole('button', { name: 'view' }).click()
        await blogA.getByRole('button', { name: 'like' }).click()
        await expect(blogA.getByText('likes 1')).toBeVisible()

        const blogB = page.locator('.blog', { hasText: 'Blogi B Testaaja B' })
        await blogB.getByRole('button', { name: 'view' }).click()
        await blogB.getByRole('button', { name: 'like' }).click()
        await expect(blogB.getByText('likes 1')).toBeVisible()
        await blogB.getByRole('button', { name: 'like' }).click()
        await expect(blogB.getByText('likes 2')).toBeVisible()

        const blogs = page.locator('.blog')
        await expect(blogs.nth(0)).toContainText('Blogi B')
        await expect(blogs.nth(1)).toContainText('Blogi A')
        await expect(blogs.nth(2)).toContainText('Testi blogi')
      })

      test('only the user who added the blog sees the delete button', async ({ page, request }) => {
        await request.post('http://localhost:5173/api/users', {
          data: {
            name: 'Toinen Testaaja',
            username: 'toitest',
            password: 'salasana'
          }
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByLabel('username').fill('toitest')
        await page.getByLabel('password').fill('salasana')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Toinen Testaaja logged in')).toBeVisible()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })
})
