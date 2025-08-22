import EmailTemplateEditor from "./email-templates/email-template-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function EmailsPage() {
  return (
    <Card className="h-full">
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
