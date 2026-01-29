"use client"
import { Button } from "@/components/ui/button"
import { generateMnemonic,mnemonicToSeedSync } from "bip39"
import { derivePath } from "ed25519-hd-key";
import { Keypair} from "@solana/web3.js"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface Wallet {
    publicKey: string;
    privateKey: Uint8Array;
}

export function Genwallet(){
    const [mn,setMn]=useState("")   
    //@ts-ignore
    const [seed,setSeed]=useState<any>(null)
    const [wallets,setWallets]=useState<Wallet[]>([])
    const [currentIndex,setCurrentIndex]=useState(0)
    const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<{[key: number]: boolean}>({})
    
    const togglePrivateKeyVisibility = (index: number) => {
        setVisiblePrivateKeys(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    return <div className="w-full max-w-4xl mx-auto pb-8">
        <div className="flex gap-3 justify-center flex-wrap">
            <Button 
                className="px-4 py-2 text-sm shadow-sm"
                onClick={()=>{
                    const m=generateMnemonic();
                    setMn(m);
                    setSeed(null);
                    setWallets([]);
                    setCurrentIndex(0);
                    setVisiblePrivateKeys({});
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
                    setWallets(prev=>[
                        ...prev,
                        {
                            publicKey: keypair.publicKey.toBase58(),
                            privateKey: keypair.secretKey
                        }
                    ]);
                    setCurrentIndex(prev=>prev+1)
                }}>
                Generate Wallet
            </Button>
        </div>

        {mn && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-sm mt-4">
                <h3 className="text-sm font-medium mb-2 text-gray-200">
                    Mnemonic Phrase
                </h3>
                <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-gray-100 font-mono text-xs leading-relaxed break-all">
                        {mn}
                    </p>
                </div>
            </div>
        )}

        {seed && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-sm mt-4">
                <h3 className="text-sm font-medium mb-2 text-gray-200">
                    Seed (Hex)
                </h3>
                <div className="bg-gray-900 p-3 rounded border border-gray-700 max-h-32 overflow-auto">
                    <p className="text-gray-100 font-mono text-xs break-all leading-relaxed">
                        {seed.toString("hex")}
                    </p>
                </div>
            </div>
        )}

        {wallets.length > 0 && (
            <div className="mt-4">
                <h3 className="text-sm font-medium mb-3 text-gray-200">
                    Wallets ({wallets.length})
                </h3>
                <div className="space-y-4">
                    {wallets.map((wallet, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-sm">
                            <div className="text-sm font-semibold text-gray-200 mb-3">
                                Wallet #{i+1}
                            </div>
                            
                            {/* Public Key Section */}
                            <div className="mb-3">
                                <div className="text-xs font-medium text-gray-400 mb-1">
                                    Public Key
                                </div>
                                <div className="bg-gray-900 p-3 rounded border border-gray-700">
                                    <p className="text-gray-100 font-mono text-xs break-all">
                                        {wallet.publicKey}
                                    </p>
                                </div>
                            </div>

                            {/* Private Key Section */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-xs font-medium text-gray-400">
                                        Private Key
                                    </div>
                                    <button
                                        onClick={() => togglePrivateKeyVisibility(i)}
                                        className="text-gray-400 hover:text-gray-200 transition-colors p-1"
                                        title={visiblePrivateKeys[i] ? "Hide private key" : "Show private key"}
                                    >
                                        {visiblePrivateKeys[i] ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="bg-gray-900 p-3 rounded border border-gray-700">
                                    {visiblePrivateKeys[i] ? (
                                        <p className="text-gray-100 font-mono text-xs break-all">
                                            {Array.from(wallet.privateKey).join(',')}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 font-mono text-xs">
                                            ••••••••••••••••••••••••••••••••••••••••
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
    </div>
}
