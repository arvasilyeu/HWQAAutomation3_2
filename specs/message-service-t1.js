const {
    startClientPC,
    startSatelite,
    stopClientPC,
    stopEarthServer,
    stopSatelite,
    stopMarsServer,
    startEarthServer,
    startMarsServer,
    sendMessage,
    assertResponse
} = require('./stubs/messageservice.stubs');

describe('Message Sending', function () {
    before('start client PC', async function () {
        startClientPC()
    })
    after('stop client PC', async function () {
        stopClientPC()
    })

    context ('sending message to Earth', async function () {
        let earthToken
        beforeEach('start Earth server', async function () {
            earthToken = startEarthServer()
        })
        afterEach('stop Earth server', async function () {
            stopEarthServer()
        })
        it('should send message to Earth without error', function () {
            const response = sendMessage('Hello', 'Earth', earthToken);
            assertResponse(response, 'Success');
        });
        it('should send message to Earth with "Security Error"', function () {
            const response = sendMessage('Hello', 'Earth', 'X0000')
            assertResponse(response, 'Security Error')
        });
    })

    context ('sending message to Mars with working satellite', async function () {
        let marsToken
        beforeEach('start Mars server', async function () {
            startSatelite()
            marsToken = startMarsServer()
        })
        afterEach('stop Mars server', async function () {
            stopMarsServer()
            stopSatelite()
        })
        it('should send message to Mars without error', function () {
            const response = sendMessage('Hello', 'Mars', marsToken);
            assertResponse(response, 'Success');
        });
        it('should send message to Mars with "Security Error"', function () {
            const response = sendMessage('Hello', 'Mars', 'X0000')
            assertResponse(response, 'Security Error')
        });
    })

    context ('sending message to Mars with not working satellite', async function () {
        let marsToken
        beforeEach('start Mars server', async function () {
            marsToken = startMarsServer()
        })
        afterEach('stop Mars server', async function () {
            stopMarsServer()
            marsToken = null
        })
        it('should send message to Mars with "Service is unavailable" (valid token)', function () {
            const response = sendMessage('Hello', 'Mars', marsToken);
            assertResponse(response, 'Service is unavailable');
        });
        it('should send message to Mars with "Service is unavailable" (invalid token)', function () {
            const response = sendMessage('Hello', 'Mars', 'X0000')
            assertResponse(response, 'Service is unavailable')
        });
    })
})