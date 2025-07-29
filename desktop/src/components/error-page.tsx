import { ArrowLeft, BookOpen, Compass, FileQuestion, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function ErrorPage() {
  return (
    <div className="h-full space-y-8 px-8 py-20 text-center md:px-32 md:py-32 lg:px-16 xl:px-32 2xl:px-64">
      <div className="mb-8 grid w-full place-items-center">
        <div className="bg-primary/20 flex size-16 items-center justify-center rounded-full">
          <FileQuestion className="text-primary size-8" />
        </div>
      </div>

      {/* Large 404 Text */}
      <div className="space-y-2">
        <h1 className="text-primary/30 text-8xl font-bold leading-none md:text-9xl">
          404
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="bg-primary/30 h-px max-w-16 flex-1"></div>
          <Compass className="text-primary/50 h-5 w-5" />
          <div className="bg-primary/30 h-px max-w-16 flex-1"></div>
        </div>
      </div>

      {/* Main Message */}
      <div className="space-y-4">
        <h2 className="text-foreground text-3xl font-bold md:text-4xl">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
          Oops! Looks like the page you are looking for doesn&apos;t exist...
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div>
          <Button size="lg" asChild className="min-w-[160px]">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="min-w-[160px] bg-transparent"
          >
            <Link to="/documentation">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Documentation
            </Link>
          </Button>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-8">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>

      {/* Footer Message */}
      <div className="border-border/50 border-t pt-8">
        <p className="text-muted-foreground text-sm">
          Need help finding something specific? Feel free to{" "}
          <Link
            to="/contact"
            className="text-primary font-medium hover:underline"
          >
            reach out
          </Link>{" "}
          and we&apos;ll be happy to assist you.
        </p>
      </div>
    </div>
  );
}
