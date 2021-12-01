describe ('UI behaviour', function () {
    before ('log in', async function () {
        await browser.addCommand("waitForText", async function (text, timeout) {
            await browser.waitUntil(
                async () => (await this.isDisplayed()) && (await this.getText() == text),
                {
                    timeout: timeout,
                    timeoutMsg: 'Expected element are absent!'
                }
            );
        }, true)
        await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick')
        await $('#login').setValue('walker@jw.com')
        await $('#password').setValue('password')
        await $('button').click()
        await $('#spinner').waitForDisplayed({ reverse: true, timeout: 15000 })
    })
    context ('check loading of status', async function () {
        it ('should load status without error', async function () {
            const checkStatusLink = await $('//*[@id="third-nav-block"]//a')
            await checkStatusLink.click()
            await checkStatusLink.waitForText('Active', 10000)
        })
    })
})