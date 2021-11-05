import { parsePath } from "./ParsePath"


test("parses empty path", () => {
    expect(
        parsePath("/"),
    ).toMatchObject(
        {},
    )
})

test("parses instance path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
        },
    )
})

test("parses username path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/u/steffo"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            userName: "steffo",
        },
    )
})

test("parses userid path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/u/1"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            userId: "1",
        },
    )
})

test("parses research group path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/g/testers"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            researchGroup: "testers",
        },
    )
})

test("parses research project path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/g/testers/p/test"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            researchGroup: "testers",
            researchProject: "test",
        },
    )
})

test("parses research project path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/g/testers/p/test/n/testerino"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            researchGroup: "testers",
            researchProject: "test",
            notebook: "testerino",
        },
    )
})
