import { Loader } from "lucide-react";

import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/client/footer/footer"), {
  loading: () => <Loader />,
});

export default Footer;
