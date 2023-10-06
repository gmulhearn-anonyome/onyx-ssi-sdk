import { DEFAULT_CONTEXT, JSONLDService, JWTService, KeyDIDMethod, VERIFIABLE_CREDENTIAL, VERIFIABLE_PRESENTATION } from "../../../src/services/common"
import { KEY_ALG } from "../../../src/utils"

describe('jsonld utilities', () => {
    const didWithKeys = {
        did: 'did:key:z6MknTZPNAtKXhYUC51KueL2RmJX6nMhZAbjfzV6LRv17Juz',
        keyPair: {
            algorithm: KEY_ALG.EdDSA,
            publicKey: '0x76f11a56051843a758f457c5891bac494056d447f3606e5131648c453d6f30f5',
            privateKey: '0xb2e15a821fe57b6af467ab4c3aaa264456a14f90bed5cf8a00f013bdbe7177be76f11a56051843a758f457c5891bac494056d447f3606e5131648c453d6f30f5'
        }
    }

    const context = [DEFAULT_CONTEXT]
    const credentialSubject = {
        id: "did:ethr:maticmum:0x5F880a6eB77c12Db2e14F29bfE3b1aaf94C95508",
        // name: "Ollie" NOTE: not valid? MISSING_PROPERTIES_IN_CONTEXT credentialSubject.name
    }
    const issuer = {
        id: didWithKeys.did
    }
    const type = [
        VERIFIABLE_CREDENTIAL,
        "ProofOfName"
    ]
    const issuanceDate = "2023-05-18T17:34:26.000Z"

    const VC_PAYLOAD = {
        '@context': context,
        credentialSubject,
        issuer,
        type,
        issuanceDate,
    }
    const holder = didWithKeys.did
    const verifiableCredential = ['eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MDQxMzcwMDQsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJQcm9vZk9mTmFtZSJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiT2xsaWUifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vZXhhbXBsZS5vcmcvZXhhbXBsZXMvZGVncmVlLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYVZhbGlkYXRvcjIwMTgifSwiY3JlZGVudGlhbFN0YXR1cyI6eyJpZCI6Imh0dHBzOi8vZXhhbXBsZS5lZHUvc3RhdHVzLzI0IiwidHlwZSI6IkNyZWRlbnRpYWxTdGF0dXNMaXN0MjAxNyJ9fSwic3ViIjoiZGlkOmV0aHI6bWF0aWNtdW06MHg1Rjg4MGE2ZUI3N2MxMkRiMmUxNEYyOWJmRTNiMWFhZjk0Qzk1NTA4IiwianRpIjoiZGlkOmV0aHI6bWF0aWNtdW06MHgyMGIxY0JCNTU0MjU5Rjc2MzZGQjQ4NzUzNkExN0UwRTcyMjQ4MzY4IiwibmJmIjoxNjg0NDMxMjY2LCJpc3MiOiJkaWQ6ZXRocjptYXRpY211bToweDQzODMzYWVCYzAxOGVkYzU4RDc3NjViYUI0OUI2MWM2RDFlOWQ1NGYifQ.hX-56L8cspoihl7tNYJwuvqhnW3XRYbJY1Hsu5HAEgJFcZGG-3yD2qCgawzLKT2twf9fcz8nBccbCuiyonUjAg']

    const VP_PAYLOAD = {
        '@context': context,
        type: VERIFIABLE_PRESENTATION,
        holder,
        verifiableCredential
    }

    fit('SignVC not implemented for jsonld', async () => {
        const jsonldService = new JSONLDService()
        const ldProof = await jsonldService.signVC(didWithKeys, VC_PAYLOAD)

        console.log(ldProof)
    })

    it('SignVP not implemented for jsonld', async () => {
        const jsonldService = new JSONLDService()
        await expect(jsonldService.signVP(didWithKeys, VP_PAYLOAD))
            .rejects.toThrowError(Error)
    })
})