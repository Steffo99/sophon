import { parsePath } from "./ParsePath"


test("parses empty path", () => {
    expect(
        parsePath("/"),
    ).toMatchObject(
        {
            count: 0,
            valid: true,
        },
    )
})

test("parses instance path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            count: 1,
            valid: true,
        },
    )
})

test("parses logged in path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/l/logged-in/"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            loggedIn: "logged-in",
            count: 2,
            valid: true,
        },
    )
})

test("parses research group path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/l/logged-in/g/testers/"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            loggedIn: "logged-in",
            researchGroup: "testers",
            count: 3,
            valid: true,
        },
    )
})

test("parses research project path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/l/logged-in/g/testers/p/test/"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            loggedIn: "logged-in",
            researchGroup: "testers",
            researchProject: "test",
            count: 4,
            valid: true,
        },
    )
})

test("parses notebook path", () => {
    expect(
        parsePath("/i/https:api:sophon:steffo:eu:/l/logged-in/g/testers/p/test/n/testerino/"),
    ).toMatchObject(
        {
            instance: "https:api:sophon:steffo:eu:",
            loggedIn: "logged-in",
            researchGroup: "testers",
            researchProject: "test",
            notebook: "testerino",
            count: 5,
            valid: true,
        },
    )
})
