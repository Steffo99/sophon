import { parsePath } from "./ParsePath"


test("splits empty path", () => {
    expect(
        parsePath("/"),
    ).toMatchObject(
        {}
    )
})

test("splits instance path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:"
        }
    )
})

test("splits username path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/u/steffo"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            userName: "steffo",
        }
    )
})

test("splits userid path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/u/1"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            userId: "1",
        }
    )
})

test("splits research group path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/g/testers"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            researchGroup: "testers",
        }
    )
})

test("splits research project path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/g/testers/p/test"),
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
        parsePath("/i/https:api:sophon:steffo:eu:/g/testers/p/test/n/testerino"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            researchGroup: "testers",
            researchProject: "test",
            notebook: "testerino",
        }
    )
})
