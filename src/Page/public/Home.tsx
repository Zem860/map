import LeafletMap from "@/components/LeafletMap";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const Home = () => {
    return (<>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
            <div className="">
                <div className="max-w-3xl mx-auto text-center">
                    <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Free Worldwide Shipping
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-balance mb-6 leading-tight">
                        Discover the World of English Literature
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                        From timeless classics to contemporary masterpieces. Explore the greatest works in English literature.
                    </p>
                </div>
            </div>
        </section>
        <LeafletMap />
    </>);
}

export default Home;