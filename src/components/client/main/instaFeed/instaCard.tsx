import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Props = { post: InstaFeed }

function InstaCard({ post }: Props) {
  return (
    <motion.div
      className="relative mx-auto flex h-full w-full max-w-[400px] flex-col rounded-xl bg-white will-change-transform md:max-w-none"
      whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
      transition={{ duration: 0.3 }} // Тривалість анімації
    >
      <div className="grid grid-cols-[auto_1fr] gap-x-[10px] px-[19px] py-[13px] font-dmsans">
        <span className="row-span-2 block aspect-[1] w-[42px] rounded-full bg-black p-[6px]">
          <Image
            src={'/icons/logo-white.svg'}
            alt="LOGO"
            className="h-full w-full"
            width={86}
            height={100}
          />
        </span>
        <p className="self-end text-[11px] font-bold leading-[1.3]">
          slicedrys
        </p>
        <p className="text-[9px] leading-[1.3]">Kyiv, UA</p>
      </div>
      <Link
        href={post.permalink}
        target="_blank"
        rel="noreferrer noopener"
        className="z-10 before:absolute before:inset-0 before:cursor-pointer"
      />
      <div className="relative">
        <Image
          src={
            ('thumbnail_url' in post && post?.thumbnail_url) ||
            ('media_url' in post && post?.media_url) ||
            ('children' in post && post.children.data[0]?.media_url) ||
            'https://via.placeholder.com/500x400?text=No+Image'
          }
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt={`Travel ${post.id}`}
          width={200}
          height={200}
          className="aspect-square w-full object-cover"
        />
        <Dots number={'children' in post ? post.children.data.length : 0} />
      </div>
      <p className="line-clamp-2 overflow-hidden overflow-ellipsis text-wrap px-[17px] pt-[12px] text-[14px] lg:text-[16px]">
        {'children' in post
          ? post?.caption || post.children.data[0]?.caption
          : post.caption}
      </p>
      <CardFooter />
    </motion.div>
  )
}
const Dots = ({ number }: { number: number }) => {
  if (!number) return null
  return (
    <div className="absolute bottom-[20px] right-[50%] flex translate-x-1/2 gap-[4px]">
      {Array.from({ length: number }).map((_, index) => (
        <span
          className="h-[10px] w-[10px] rounded-full bg-slate-400"
          key={index}
        ></span>
      ))}
    </div>
  )
}
const CardFooter = () => {
  return (
    <div className="flex items-center gap-[10px] px-[17px] pb-[14px] pt-[12px]">
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5114 21.1565C12.5114 21.1565 2.92871 15.7902 2.92871 9.27401C2.92871 8.12207 3.32782 7.0057 4.05814 6.11485C4.78847 5.224 5.80488 4.6137 6.93445 4.38779C8.06403 4.16187 9.23699 4.3343 10.2538 4.87573C11.2705 5.41716 12.0683 6.29414 12.5114 7.35748V7.35748C12.9544 6.29414 13.7522 5.41716 14.769 4.87573C15.7858 4.3343 16.9587 4.16187 18.0883 4.38779C19.2179 4.6137 20.2343 5.224 20.9646 6.11485C21.6949 7.0057 22.094 8.12207 22.094 9.27401C22.094 15.7902 12.5114 21.1565 12.5114 21.1565Z"
          stroke="#7D7D7D"
          strokeWidth="1.53323"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        width="26"
        height="25"
        viewBox="0 0 26 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.32828 17.4184C4.18688 15.4927 3.78763 13.2166 4.20549 11.0174C4.62335 8.81814 5.82958 6.84706 7.59773 5.47416C9.36588 4.10126 11.5744 3.42096 13.8085 3.56097C16.0427 3.70099 18.149 4.65169 19.7319 6.2346C21.3148 7.81751 22.2655 9.92377 22.4055 12.158C22.5455 14.3922 21.8652 16.6006 20.4923 18.3688C19.1194 20.1369 17.1484 21.3432 14.9491 21.761C12.7499 22.1789 10.4738 21.7796 8.54806 20.6382V20.6382L5.36661 21.539C5.23627 21.5771 5.09807 21.5795 4.9665 21.5458C4.83492 21.5122 4.71483 21.4437 4.6188 21.3477C4.52277 21.2517 4.45434 21.1316 4.42069 21C4.38703 20.8684 4.38939 20.7302 4.42751 20.5999L5.32828 17.4184Z"
          stroke="#7D7D7D"
          strokeWidth="1.53323"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        width="26"
        height="25"
        viewBox="0 0 26 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.865 3.89763L3.00292 8.92853C2.85086 8.9701 2.71532 9.05753 2.61476 9.17892C2.51419 9.3003 2.45349 9.44974 2.44092 9.60687C2.42835 9.764 2.46452 9.92118 2.54451 10.057C2.6245 10.1928 2.74442 10.3007 2.88792 10.3659L11.0907 14.2469C11.2514 14.3213 11.3804 14.4504 11.4548 14.611L15.3358 22.8138C15.401 22.9573 15.5089 23.0772 15.6447 23.1572C15.7806 23.2372 15.9377 23.2734 16.0949 23.2608C16.252 23.2482 16.4014 23.1875 16.5228 23.087C16.6442 22.9864 16.7316 22.8509 16.7732 22.6988L21.8041 4.83673C21.8422 4.70638 21.8446 4.56818 21.8109 4.43661C21.7773 4.30504 21.7089 4.18495 21.6128 4.08892C21.5168 3.99289 21.3967 3.92446 21.2651 3.8908C21.1336 3.85715 20.9954 3.8595 20.865 3.89763V3.89763Z"
          stroke="#7D7D7D"
          strokeWidth="1.53323"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.3389 14.3607L15.6702 10.0293"
          stroke="#7D7D7D"
          strokeWidth="1.53323"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        className="ml-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.6223 21.9231L12.4894 18.0901L6.35645 21.9231V5.05763C6.35645 4.85431 6.43721 4.65932 6.58098 4.51555C6.72475 4.37178 6.91974 4.29102 7.12306 4.29102H17.8556C18.059 4.29102 18.254 4.37178 18.3977 4.51555C18.5415 4.65932 18.6223 4.85431 18.6223 5.05763V21.9231Z"
          stroke="#7D7D7D"
          strokeWidth="1.53323"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default InstaCard
