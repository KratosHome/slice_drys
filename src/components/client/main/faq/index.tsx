import { Loader } from "lucide-react";

import dynamic from "next/dynamic";

const Faq = dynamic(() => import("@/components/client/main/faq/faq"), {
  loading: () => <Loader />,
});

export default Faq;
