import {splitPath} from "./PathSplitter"


test("splits empty path", () => {
    expect(
        splitPath("/")
    ).toMatchObject(
        {}
    )
})

test("splits instance path", () => {
    expect(
        splitPath("/i/https:api:sophon:steffo:eu:")
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:"
        }
    )
})

test("splits username path", () => {
    expect(
        splitPath("/i/https:api:sophon:steffo:eu:/u/steffo")
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            userName: "steffo",
        }
    )
})

test("splits userid path", () => {
    expect(
        splitPath("/i/https:api:sophon:steffo:eu:/u/1")
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            userId: "1",
        }
    )
})

test("splits research group path", () => {
    expect(
        splitPath("/i/https:api:sophon:steffo:eu:/g/testers")
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            researchGroup: "testers",
        }
    )
})

test("splits research project path", () => {
    expect(
        splitPath("/i/https:api:sophon:steffo:eu:/g/testers/p/test")
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            researchGroup: "testers",
            researchProject: "test",
        }
    )
})

test("splits research project path", () => {
    expect(
        splitPath("/i/https:api:sophon:steffo:eu:/g/testers/p/test/n/testerino")
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            researchGroup: "testers",
            researchProject: "test",
            notebook: "testerino",
        }
    )
})
