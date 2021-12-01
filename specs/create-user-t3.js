const userData =  {
    'email' : 'first-user-email@mail.com',
    'password' : 'first-user-password',
    'address1' : 'first user address',
    "city" : 'Minsk',
    'zip' : '000011',
    'description' : 'first description',
}

async function fillFormUsingJson (user) {
    const formObject = JSON.parse(JSON.stringify(user))
    for (const field in formObject) {
        await $(`//*[@id="${field}"]`).setValue(formObject[field])    
    }
}

function assertField (actual, expected) {
    if (actual !== expected) {
        throw new Error(`Failed: new user has a wrong field value\n expected: '${expected}'\n actual: '${actual}'`);
    }
}

async function assertUser (user) {
    const userObject = JSON.parse(JSON.stringify(user))
    const userRow = await $(`//*[text()="${userObject.email}"]/..`)
    assertField(await userRow.$('.//*[@tabulator-field="address1"]').getText(), userObject.address1)
    assertField(await userRow.$('.//*[@tabulator-field="city"]').getText(), userObject.city)
    assertField(await userRow.$('.//*[@tabulator-field="zip"]').getText(), userObject.zip)
    assertField(await userRow.$('.//*[@tabulator-field="description"]').getText(), userObject.description)
}

describe ('user creation behaviour', function () {
    before ('log in', async function () {
        await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick')
        await $('#login').setValue('walker@jw.com')
        await $('#password').setValue('password')
        await $('button').click()
        await $('#spinner').waitForDisplayed({ reverse: true, timeout: 15000 })
    })
    context ('create user', async function () {
        it ('should create user without error', async function () {
            await $('//*[@id="first-nav-block"]/*[7]').click()
            await fillFormUsingJson(userData)
            await $('//button[contains(text(), "Create")]').click()
            await assertUser(userData)
        })
    })
})