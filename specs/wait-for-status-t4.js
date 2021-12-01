async function waitForText(selector, text, timeout) {
    await browser.waitUntil(
        async () => (await $(selector).isDisplayed()) && (await $(selector).getText() == text),
        {
            timeout: timeout,
            timeoutMsg: 'Expected element are absent!'
        }
    );
}

describe ('UI behaviour', function () {
    before ('log in', async function () {
        await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick')
        await $('#login').setValue('walker@jw.com')
        await $('#password').setValue('password')
        await $('button').click()
        await $('#spinner').waitForDisplayed({ reverse: true, timeout: 15000 })
    })
    context ('check loading of status', async function () {
        it ('should load status without error', async function () {
            const selector = '//*[@id="third-nav-block"]//a' 
            await $(selector).click()
            await waitForText(selector, 'Active', 10000)
        })
    })
})