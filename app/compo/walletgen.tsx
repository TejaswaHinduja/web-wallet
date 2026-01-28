"use client"
import { Button } from "@/components/ui/button"
import { generateMnemonic,mnemonicToSeedSync } from "bip39"
import { derivePath } from "ed25519-hd-key";
import { Keypair} from "@solana/web3.js"
import { useState } from "react"

export function Genwallet(){
    const [mn,setMn]=useState("")   
    //@ts-ignore
    const [seed,setSeed]=useState<any>(null)
    const [pubkey,setPubKey]=useState<string[]>([])
    const [currentIndex,setCurrentIndex]=useState(0)
    
    return <div className="w-full max-w-4xl mx-auto pb-8">
        <div className="flex gap-3 justify-center flex-wrap">
            <Button 
                className="px-4 py-2 text-sm shadow-sm"
                onClick={()=>{
                    const m=generateMnemonic();
                    setMn(m);
                    setSeed(null);
                    setPubKey([]);
                    setCurrentIndex(0);
                }}>
                Generate Mnemonic
            </Button>

            <Button 
                className="px-4 py-2 text-sm shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!mn}
                onClick={()=>{
                    const s=mnemonicToSeedSync(mn);
                    setSeed(s);
                }}>
                Show Seed
            </Button>

            <Button 
                className="px-4 py-2 text-sm shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!seed}
                onClick={()=>{
                    const path=`m/44'/501'/${currentIndex}'/0'`
                    const deriveSeed=derivePath(path,seed.toString("hex")).key;
                    const keypair=Keypair.fromSeed(deriveSeed);
                    setPubKey(prev=>[
                        ...prev,
                        keypair.publicKey.toBase58()
                    ]);
                    setCurrentIndex(prev=>prev+1)
                }}>
                Generate Wallet
            </Button>
        </div>

        {mn && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700">
                    Mnemonic Phrase
                </h3>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-gray-800 font-mono text-xs leading-relaxed break-all">
                        {mn}
                    </p>
                </div>
            </div>
        )}

        {seed && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700">
                    Seed (Hex)
                </h3>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 max-h-32 overflow-auto">
                    <p className="text-gray-800 font-mono text-xs break-all leading-relaxed">
                        {seed.toString("hex")}
                    </p>
                </div>
            </div>
        )}

        {pubkey.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-2 text-gray-700">
                    Wallets ({pubkey.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-auto">
                    {pubkey.map((pk, i) => (
                        <div key={i} className="bg-gray-50 p-3 rounded border border-gray-200">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                                Wallet #{i + 1}
                            </div>
                            <p className="text-gray-800 font-mono text-xs break-all">
                                {pk}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
}
