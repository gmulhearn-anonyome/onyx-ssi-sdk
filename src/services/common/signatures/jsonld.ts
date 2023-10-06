import { CredentialPayload, CreateCredentialOptions, PresentationPayload, CreatePresentationOptions } from "did-jwt-vc";
import { DIDWithKeys } from "../did/did";
import { SignatureService } from "./signatures";
import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "@transmute/ed25519-signature-2018";
import { verifiable } from '@transmute/vc.js';
import { KEY_ALG, KeyUtils } from "../../../utils";
import { Did, Url, documentLoaderFactory } from "@transmute/jsonld-document-loader";
import axios from "axios";

export class JSONLDService implements SignatureService {
    /**
     * 
     * @param keys - `DIDWithKeys` - the DID and the keypair that will sign the token
    * @param token - `CredentialPayload` - the Credential object
     * @param _configs Currently not supported yet.
     * @returns JSON stringified JSON-LD token
     */
    async signVC(keys: DIDWithKeys, token: CredentialPayload, _configs?: CreateCredentialOptions | undefined): Promise<string> {
        const key = await this.createEd25519VerificationKey(keys)
        
        const credential = {
            '@context': token["@context"],
            // id: token.id,
            type: token.type,
            issuer: token.issuer,
            issuanceDate: token.issuanceDate instanceof Date 
                ? token.issuanceDate.toISOString() 
                : token.issuanceDate,
            credentialSubject: token.credentialSubject,
        };

        console.log(credential)
        
        // https://github.com/transmute-industries/verifiable-data/tree/main/packages/jsonld-document-loader
        const documentLoader = documentLoaderFactory.build({
            ["https://"]: async (iri: Url) => {
                const { data } = await axios.get(iri);
                return data;
            },
            // ["did:key"]: async (did: Did) => {
            //     const endpoint = `https://api.did.actor/api/identifiers/${did}`;
            //     const { data } = await axios.get(endpoint);
            //     return data.didDocument;
            // },
            // ["did:ethr"]: async (_did: Did) => {
            //     throw new Error('did:ethr lacks support for Ed25519 signatures');
            // }
        });

        // https://www.npmjs.com/package/@transmute/ed25519-signature-2018
        // https://github.com/transmute-industries/verifiable-data/tree/main/packages/vc.js#transmutevcjs
        const vc = await verifiable.credential.create({
            credential,
            format: ["vc"],
            documentLoader: (iri) => { 
                console.log(iri)
                return documentLoader(iri)
            }, 
            suite: new Ed25519Signature2018({
                key
            })
        });

        // Stringify the credential for compability between languages 
        // and conform to the SignatureService's function signature
        return JSON.stringify(vc.items[0]); // TODO - is this indexing fine?
        
    }
    async signVP(_keys: DIDWithKeys, _token: PresentationPayload, _configs?: CreatePresentationOptions | undefined): Promise<string> {
        // https://github.com/transmute-industries/verifiable-data/tree/main/packages/vc.js#verify-presentation
        throw new Error("Method not implemented.");
    }

    /**
     * Creates a verification key to sign the credential.
     * 
     * @param keys `DIDWithKeys` to use in signing the credential.
     * @returns `Ed25519VerificationKey2018` the verification key to sign the credential.
     */
    async createEd25519VerificationKey(keys: DIDWithKeys): Promise<Ed25519VerificationKey2018> {
        const { did, keyPair } = keys;
        const id = did.split(':').pop();

        if (keys.keyPair.algorithm !== KEY_ALG.EdDSA) {
            throw new Error("Key must have EdDSA algorithm to be converted into an Ed25519VerificationKey2018")
        }

        const base58Keys = KeyUtils.encodeToBase58(keyPair)

        return await Ed25519VerificationKey2018.from({
            id: `${did}#${id}`,
            type: "Ed25519VerificationKey2018", // Used for legacy and compability; Ed25519Signature2020 is for greenfield
            controller: did,
            publicKeyBase58: base58Keys.publicKey,
            privateKeyBase58: base58Keys.privateKey,
        });
    }
    
    name = 'jsonld'

}