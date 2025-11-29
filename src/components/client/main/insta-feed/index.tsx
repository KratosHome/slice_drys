import { Loader } from "lucide-react";

import dynamic from "next/dynamic";

const InstaFeed = dynamic(
  () => import("@/components/client/main/insta-feed/Insta-feed"),
  {
    loading: () => <Loader />,
  },
);

export default InstaFeed;
