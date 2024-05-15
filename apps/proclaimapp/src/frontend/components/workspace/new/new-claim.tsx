import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import UploadOne from "./upload-one";
import UploadMany from "./upload-many";

export default function NewClaims({ workspace }: { workspace: string }) {
  return (
    <Tabs defaultValue="one" className="flex h-full w-full flex-col">
      <TabsList className="w-fit">
        <TabsTrigger value="one">Create Claim</TabsTrigger>
        <TabsTrigger value="many">Upload Multiple</TabsTrigger>
      </TabsList>
      <TabsContent value="one" className="flex-1">
        <UploadOne workspace={workspace} />
      </TabsContent>
      <TabsContent value="many">
        <UploadMany workspace={workspace} />
      </TabsContent>
    </Tabs>
  );
}
