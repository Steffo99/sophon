// noinspection JSCheckFunctionSignatures

import { InstanceEncoder } from "./InstanceEncoder"


test("encodes pathless URL", () => {
    expect(
        InstanceEncoder.encode(new URL("https://api.sophon.steffo.eu")),
    ).toEqual(
        "https:api.sophon.steffo.eu",
    )
})

test("encodes URL with port number", () => {
    expect(
        InstanceEncoder.encode(new URL("http://localhost:30033")),
    ).toEqual(
        "http:localhost%3A30033",
    )
})

test("encodes URL with simple path", () => {
    expect(
        InstanceEncoder.encode(new URL("https://steffo.eu/sophon/api/")),
    ).toEqual(
        "https:steffo.eu:sophon:api:",
    )
})

test("encodes URL with colon in path", () => {
    expect(
        InstanceEncoder.encode(new URL("https://steffo.eu/sophon:api/")),
    ).toEqual(
        "https:steffo.eu:sophon%3Aapi:",
    )
})

test("does not encode URL with %3A in path", () => {
    expect(() => {
        InstanceEncoder.encode(new URL("https://steffo.eu/sophon%3Aapi/"))
    }).toThrow()
})

test("decodes pathless URL", () => {
    expect(
        InstanceEncoder.decode("https:api.sophon.steffo.eu"),
    ).toEqual(
        "https://api.sophon.steffo.eu",
    )
})

test("decodes URL with port number", () => {
    expect(
        InstanceEncoder.decode("http:localhost%3A30033"),
    ).toEqual(
        "http://localhost:30033",
    )
})

test("decodes URL with simple path", () => {
    expect(
        InstanceEncoder.decode("https:steffo.eu:sophon:api:"),
    ).toEqual(
        "https://steffo.eu/sophon/api/",
    )
})

test("decodes URL with colon in path", () => {
    expect(
        InstanceEncoder.decode("https:steffo.eu:sophon%3Aapi:"),
    ).toEqual(
        "https://steffo.eu/sophon:api/",
    )
})
