import React from 'react'
import Image from 'next/image';

function Logo() {
  return (
    <>
    <Image src={"/imgs/logo.png"} alt="alt" width={208} height={81} />
    </>
  )
}

export default Logo
