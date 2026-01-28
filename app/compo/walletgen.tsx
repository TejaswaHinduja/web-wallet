"use client"
import { Button } from "@/components/ui/button"
import { generateMnemonic,mnemonicToSeedSync } from "bip39"
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js"
import { useState,useEffect } from "react"

export function Genwallet(){
    const [mn,setMn]=useState("")   
    //@ts-ignore
    const [seed,setSeed]=useState<any>(null)
    const [currentIndex,setCurrentIndex]=useState()
    
    return <div>
        <Button className="cursor-pointer"
        onClick={()=>{
            const m=generateMnemonic();
            setMn(m);
            setSeed(null);
        }}>
            Generate Mneomonic
        </Button>

        <Button className="cursor-pointer"
        disabled={!mn}
        onClick={()=>{
            const s=mnemonicToSeedSync(mn);
            setSeed(s);
        }}>
            Show seed
        </Button>

        <Button onClick={()=>{}}></Button>

        <div>{mn}</div>
        <div>{seed && seed.toString("hex")}</div>
    </div>
}
