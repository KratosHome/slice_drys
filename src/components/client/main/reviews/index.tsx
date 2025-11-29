import { Loader } from "lucide-react";

import dynamic from "next/dynamic";

const Reviews = dynamic(
  () => import("@/components/client/main/reviews/reviews"),
  {
    loading: () => <Loader />,
  },
);

export default Reviews;
