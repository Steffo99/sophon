import {InstanceEncoder} from "./InstanceEncoder"

test("encodes pathless URL", () => {
    expect(
        InstanceEncoder.encode(new URL("https://api.sophon.steffo.eu"))
    ).toStrictEqual(
        "https:api.sophon.steffo.eu:"
    )
})

test("encodes URL with simple path", () => {
    expect(
        InstanceEncoder.encode(new URL("https://steffo.eu/sophon/api/"))
    ).toStrictEqual(
        "https:steffo.eu:sophon:api:"
    )
})

test("encodes URL with colon in path", () => {
    expect(
        InstanceEncoder.encode(new URL("https://steffo.eu/sophon:api/"))
    ).toStrictEqual(
        "https:steffo.eu:sophon%3Aapi:"
    )
})

test("does not encode URL with %3A in path", () => {
    expect(() => {
        InstanceEncoder.encode(new URL("https://steffo.eu/sophon%3Aapi/"))
    }).toThrow()
})

test("decodes pathless URL", () => {
    expect(
        InstanceEncoder.decode("https:api.sophon.steffo.eu")
    ).toStrictEqual(
        new URL("https://api.sophon.steffo.eu")
    )
})

test("decodes URL with simple path", () => {
    expect(
        InstanceEncoder.decode("https:steffo.eu:sophon:api:")
    ).toStrictEqual(
        new URL("https://steffo.eu/sophon/api/")
    )
})

test("decodes URL with colon in path", () => {
    expect(
        InstanceEncoder.decode("https:steffo.eu:sophon%3Aapi:")
    ).toStrictEqual(
         new URL("https://steffo.eu/sophon:api/")
    )
})
