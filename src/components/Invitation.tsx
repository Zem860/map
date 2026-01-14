import { Button } from "./ui/button";
import { Mail } from "lucide-react";
const Invatation = () => {
    return (
        <>
            {/* Reader Review Invitation */}

            <section className="py-12 border-y bg-muted/20">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        {/* Quote */}
                        <div className="space-y-3">
                            <p className="text-2xl md:text-3xl font-serif italic text-foreground/90 text-balance leading-relaxed">
                                "Die Grenzen meiner Sprache sind die Grenzen meiner Welt"
                            </p>
                            <p className="text-sm md:text-base text-muted-foreground">— Ludwig Wittgenstein</p>
                        </div>

                        {/* Divider */}
                        <div className="w-16 h-px bg-border mx-auto" />

                        {/* Content */}
                        <div className="space-y-4 pt-4">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-balance">Write to Our Curators</h2>
                            <p className="text-base md:text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
                                Have a story to tell? We'd love to hear your thoughts on your latest read. Share your review with our
                                community of book lovers.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-6">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                                <a href="mailto:hello@literaryhaven.com">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Send Your Review via Email
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>);
}

export default Invatation;