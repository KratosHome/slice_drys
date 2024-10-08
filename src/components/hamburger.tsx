import { useState } from 'react';
import { cn } from '@/utils/cn'

type Props = {
  className: string
}

export default function Hamburger({className}: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <div className={cn(`tham tham-e-squeeze tham-w-10 mob:tham-w-8`, className, { 'tham-active': opened })}>
      <div className="tham-box">
        <div className="tham-inner" />
      </div>
    </div>
  );
}