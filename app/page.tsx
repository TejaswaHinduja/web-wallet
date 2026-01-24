"use client"
import { LampContainer } from "@/components/ui/lamp";
import { Genwallet } from "./compo/walletgen";

export default function Home() {
  return (<div>
    <LampContainer>
          <Genwallet/>
    </LampContainer>

  </div>
  
  );
}
