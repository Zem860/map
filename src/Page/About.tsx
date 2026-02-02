import { ArrowRight } from "lucide-react"
import {Link} from "react-router-dom"

export default function About() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#2C2C2C] selection:bg-primary/20">
      {/* Narrative Container */}
      <article className="mx-auto max-w-2xl px-6 py-20 md:py-32 space-y-28">      
        {/* Section 1: Philosophy */}
        <section className="space-y-8">
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] text-balance tracking-tight">
            We believe stories shouldn’t have borders.
          </h1>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              In an increasingly digital world, we remain devoted to the tactile—the weight of a hardcover, the scent of fresh ink, and the quiet intimacy of a well-worn page.
            </p>
            <p>
              <strong className="text-foreground font-semibold">BookHaven</strong> was founded on a singular, powerful idea: that the distance between a reader and a great book should never be measured by the cost of shipping.
            </p>
          </div>
        </section>
        {/* Section 2: The Tribute (The Soul of the Page) */}
        <section className="relative py-12 px-8 bg-muted/40 rounded-2xl border-l-4 border-primary">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">
            The Legacy
          </span>
          <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">For the Wanderers</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              When <span className="italic">Book Depository</span> closed its doors in 2023, the global community of readers lost more than just a bookstore—they lost a bridge. 
            </p>
            <p>
              We remember that iconic teal package and the promise it held. BookHaven was born to carry that torch forward, ensuring that readers in Taipei, Tokyo, London, or beyond still have a home.
            </p>
            <p className="text-foreground font-medium pt-2">
              To every reader who once waited for a teal envelope—welcome home.
            </p>
          </div>
        </section>
        {/* Section 3: The Promise */}
        <section className="space-y-12">
          <h2 className="font-serif text-3xl text-foreground">Our Commitment</h2>
          <div className="grid gap-12">
            <div className="flex gap-8">
              <span className="font-serif text-5xl text-primary/20 select-none">01</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Free Worldwide Delivery</h3>
                <p className="text-muted-foreground">No minimum spend, no hidden fees, and no exceptions. One book or twenty, the shipping is on us.</p>
              </div>
            </div>
            <div className="flex gap-8">
              <span className="font-serif text-5xl text-primary/20 select-none">02</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Curated Without Limits</h3>
                <p className="text-muted-foreground">From global bestsellers to obscure indie gems, we source from publishers worldwide to bring the world’s library to your doorstep.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Final CTA */}
        <section className="pt-20 text-center space-y-10 border-t border-border">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl italic text-foreground">Ready for your next chapter?</h2>
            <p className="text-muted-foreground">Explore over a million titles waiting to be discovered.</p>
          </div>
          <Link
            to="/"
            className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-full font-medium transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20"
          >
            Start Reading <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      </article>
      <footer className="py-20 text-center text-xs text-muted-foreground/60 tracking-widest uppercase">
        <p>© 2026 BookHaven. Reading Without Borders.</p>
      </footer>
    </main>
  )
}