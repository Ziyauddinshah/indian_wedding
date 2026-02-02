// app/page.tsx
import HeroSection from '@/app/components/home/HeroSection'
import CategoryShowcase from '@/app/components/home/CategoryShowcase'
import CitySelector from '@/app/components/home/CitySelector'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryShowcase />
      <CitySelector />
    </div>
  )
}