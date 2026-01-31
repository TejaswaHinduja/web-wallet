"use client"
import { Button } from "@/components/ui/button"
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39"
import { derivePath } from "ed25519-hd-key";
import { Keypair} from "@solana/web3.js"
import { useState } from "react"
import { Eye, EyeOff, Import, Trash2 } from "lucide-react"

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
    const [importMode, setImportMode] = useState(false)
    const [importInput, setImportInput] = useState("")
    const [error, setError] = useState("")
    
    const togglePrivateKeyVisibility = (index: number) => {
        setVisiblePrivateKeys(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const handleImportMnemonic = () => {
        setError("")
        const trimmedInput = importInput.trim()
        
        if (!validateMnemonic(trimmedInput)) {
            setError("Invalid mnemonic phrase. Please check and try again.")
            return
        }

        setMn(trimmedInput)
        const s = mnemonicToSeedSync(trimmedInput)
        setSeed(s)
        
        // Automatically derive the first wallet
        const path = `m/44'/501'/0'/0'`
        const deriveSeed = derivePath(path, s.toString("hex")).key
        const keypair = Keypair.fromSeed(deriveSeed)
        
        setWallets([{
            publicKey: keypair.publicKey.toBase58(),
            privateKey: keypair.secretKey
        }])
        setCurrentIndex(1) 
        setVisiblePrivateKeys({})
        setImportInput("")
        setImportMode(false)
    }

    const handleGenerateMnemonic = () => {
        const m = generateMnemonic();
        setMn(m);
        setSeed(null);
        setWallets([]);
        setCurrentIndex(0);
        setVisiblePrivateKeys({});
        setError("");
        setImportMode(false);
    }

    return <div className="w-full max-w-4xl mx-auto pb-8">
        <div className="flex gap-3 justify-center flex-wrap mb-4">
            <Button 
                className="px-4 py-2 text-sm shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={handleGenerateMnemonic}>
                Generate Mnemonic
            </Button>

            <Button 
                className="px-4 py-2 text-sm shadow-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"
                onClick={() => {
                    setImportMode(!importMode)
                    setError("")
                }}>
                <Import className="w-4 h-4 mr-2" />
                {importMode ? "Cancel Import" : "Import Mnemonic"}
            </Button>

            <Button 
                className="px-4 py-2 text-sm shadow-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-700"
                disabled={!mn}
                onClick={()=>{
                    const s=mnemonicToSeedSync(mn);
                    setSeed(s);
                }}>
                Show Seed
            </Button>

            <Button 
                className="px-4 py-2 text-sm shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-700"
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
                Add Wallet
            </Button>

            {(mn || wallets.length > 0) && (
                <Button 
                    className="px-4 py-2 text-sm shadow-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                    onClick={() => {
                        setMn("")
                        setSeed(null)
                        setWallets([])
                        setCurrentIndex(0)
                        setVisiblePrivateKeys({})
                        setError("")
                        setImportMode(false)
                        setImportInput("")
                    }}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                </Button>
            )}
        </div>

        {/* Import Mnemonic Section */}
        {importMode && (
            <div className="bg-gray-800 rounded-lg border border-purple-600 p-4 shadow-lg mb-4 animate-in fade-in duration-200">
                <h3 className="text-sm font-medium mb-3 text-purple-300 flex items-center">
                    <Import className="w-4 h-4 mr-2" />
                    Import Existing Wallet
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                    Enter your 12 or 24 word mnemonic phrase to recover your wallet. 
                    Your first wallet will be automatically generated. You can then generate additional wallets if needed.
                </p>
                <textarea
                    value={importInput}
                    onChange={(e) => {
                        setImportInput(e.target.value)
                        setError("")
                    }}
                    placeholder="Enter your mnemonic phrase here (e.g., word1 word2 word3 ...)"
                    className="w-full bg-gray-900 text-gray-100 p-3 rounded border border-gray-700 focus:border-purple-500 focus:outline-none font-mono text-xs min-h-[100px] resize-y"
                />
                {error && (
                    <div className="mt-2 text-xs text-red-400 bg-red-950/50 border border-red-800 rounded p-2">
                        {error}
                    </div>
                )}
                <div className="flex gap-2 mt-3">
                    <Button asChild>
                        <button
                            onClick={handleImportMnemonic}
                            disabled={!importInput.trim()}
                            className="px-4 py-2 text-sm bg-black hover:bg-gray-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Import Wallet
                        </button>
                    </Button>
                    <Button 
                        onClick={() => {
                            setImportMode(false)
                            setImportInput("")
                            setError("")
                        }}
                        className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white font-medium"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        )}

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
                <p className="text-xs text-yellow-500 mt-2 flex items-center">
                    ⚠️ Never share your mnemonic phrase with anyone. Store it securely offline.
                </p>
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
