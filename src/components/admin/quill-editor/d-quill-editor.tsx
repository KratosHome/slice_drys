import { Loader } from "lucide-react";

import dynamic from "next/dynamic";

const QuillEditor = dynamic(
  () => import("@/components/admin/quill-editor/quill-editor"),
  {
    loading: () => <Loader />,
  },
);

export default QuillEditor;
