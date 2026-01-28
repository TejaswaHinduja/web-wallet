"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-linear-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  );
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-gray-50 w-full z-0",
        className
      )}
    >
      <div className="relative flex w-full h-64 items-center justify-center isolate z-0 mt-8">
        <motion.div
          initial={{ opacity: 0.3, width: "20rem" }}
          whileInView={{ opacity: 0.6, width: "40rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-64 overflow-visible w-[40rem] bg-gradient-conic from-blue-300 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-gray-50 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-48 h-[100%] left-0 bg-gray-50 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.3, width: "20rem" }}
          whileInView={{ opacity: 0.6, width: "40rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-64 w-[40rem] bg-gradient-conic from-transparent via-transparent to-blue-300 [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-48 h-[100%] right-0 bg-gray-50 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-gray-50 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-40 w-full translate-y-8 scale-x-150 bg-gray-50 blur-2xl"></div>
        <div className="absolute inset-auto z-50 h-32 w-[36rem] -translate-y-1/2 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-32 w-64 -translate-y-[4rem] rounded-full bg-blue-200 opacity-40 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[5rem] bg-blue-300 opacity-70"
        ></motion.div>

        <div className="absolute inset-auto z-40 h-40 w-full -translate-y-[12rem] bg-gray-50"></div>
      </div>

      <div className="relative z-50 flex flex-col items-center px-5 w-full max-w-6xl -mt-42">
        {children}
      </div>
    </div>
  );
};
