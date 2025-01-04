import  {Header}  from '../components/header'
import  {Footer}  from '../components/footer'
import  ReadmeGenerator  from '..//components/readme-generator'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <ReadmeGenerator />
        </div>
      </main>
      <Footer />
    </div>
  )
}

