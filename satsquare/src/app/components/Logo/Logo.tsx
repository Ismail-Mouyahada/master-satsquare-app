import React from 'react'
import Image from 'next/image';

function Logo() {
  return (
    <>
    <Image src={"/imgs/logo.png"} alt="alt" width={178} height={51} />
    </>
  )
}

export default Logo
