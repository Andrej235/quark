import EmailTemplateEditor from "./email-templates/email-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function EmailsPage() {
  return (
    <Card className="h-full border-none bg-transparent">
      <CardHeader>
        <CardTitle>Edit email template</CardTitle>
        <CardDescription>
          Edit the content of the email template below
        </CardDescription>
      </CardHeader>

      <CardContent>
        <EmailTemplateEditor />
      </CardContent>
    </Card>
  );
}
