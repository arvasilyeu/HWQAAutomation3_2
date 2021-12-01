const managers = [ {
    'role' : 'manager',
    'email' : 'first-email@mail.com',
    'password' : 'first-password',
    'address' : 'first address',
    'state' : {
        'short' : 'US',
        'long' : 'United States'
    },
    'zip' : '000001',
    'description' : 'first description',
    'demoBalance' : 'on',
    'waitSupervisor' : 'on',
    'managerType' : 'region',
    "city" : 'Minsk'
}, {
    'role' : 'manager',
    'email' : 'second-email@mail.com',
    'password' : 'second-password',
    'address' : 'second address',
    'state' : {
        'short' : 'CA',
        'long' : 'Canada'
    },
    'zip' : '000002',
    'description' : 'second description',
    'demoBalance' : '',
    'waitSupervisor' : 'on',
    'managerType' : 'country',
    'city' : 'Moskow'
} ]

async function fillFormUsingJson (manager) {
    await $('//*[@id="first-nav-block"]/*[8]').click()
    await $('//*[@id="email"]').setValue(manager.email)
    await $('//*[@id="password"]').setValue(manager.password)
    await $('//*[@id="address1"]').setValue(manager.address)
    await $('//*[@id="state"]').click()
    await $('//*[@id="state"]').selectByVisibleText(manager.state.long)
    await $('//*[@id="zip"]').setValue(manager.zip)
    await $('//*[@id="description"]').setValue(manager.description)
    if (manager.demoBalance == 'on') {
        await $('//*[@id="demo-balance"]').click()
    }
    if (manager.waitSupervisor == 'on') {
        await $('//*[@id="wait-supervisor"]').click()
    }
    switch (manager.managerType) {
        case 'region' : 
            await $('(//*[@type="radio"])[1]').click()
            break
        case 'country' :
            await $('(//*[@type="radio"])[2]').click()
            break
    }
    await $('//*[@id="city"]').setValue(manager.city)
    await $('//*[@id="autoComplete_list_1"]/*[1]').click()
    await $('//button[contains(text(), "Create")]').click()
}

function assertField (actual, expected) {
    if (actual !== expected) {
        throw new Error(`Failed: new manager has a wrong field value\n expected: '${expected}'\n actual: '${actual}'`);
    }
}

async function assertManager (manager) {
    const userRow = await $(`//*[text()="${manager.email}"]/..`)
    assertField(await userRow.$('.//*[@tabulator-field="role"]').getText(), manager.role)
    assertField(await userRow.$('.//*[@tabulator-field="address1"]').getText(), manager.address)
    assertField(await userRow.$('.//*[@tabulator-field="city"]').getText(), manager.city)
    assertField(await userRow.$('.//*[@tabulator-field="state"]').getText(), manager.state.short)
    assertField(await userRow.$('.//*[@tabulator-field="zip"]').getText(), manager.zip)
    assertField(await userRow.$('.//*[@tabulator-field="description"]').getText(), manager.description)
    assertField((await userRow.$('.//*[@tabulator-field="demo-balance"]').getText()).trim(), manager.demoBalance)
    assertField((await userRow.$('.//*[@tabulator-field="wait-supervisor"]').getText()).trim(), manager.waitSupervisor)
    assertField(await userRow.$('.//*[@tabulator-field="manager-type"]').getText(), manager.managerType)
}

describe ('user creation behaviour', function () {
    before ('log in', async function () {
        await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick')
        await $('#login').setValue('walker@jw.com')
        await $('#password').setValue('password')
        await $('button').click()
        await $('#spinner').waitForDisplayed({ reverse: true, timeout: 15000 })
    })
    context ('create manager', async function () {
        it ('should create first manager without error', async function () {
            await fillFormUsingJson(managers[0])
            await assertManager(managers[0])
        })
        it ('should create second manager without error', async function () {
            await fillFormUsingJson(managers[1])
            await assertManager(managers[1])
        })
    })
})