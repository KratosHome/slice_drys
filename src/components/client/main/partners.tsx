import { FC } from 'react'

interface PartnersProps {
  data: any
}

const Partners: FC<PartnersProps> = ({ data }) => {
  const partners = [
    {
      name: 'National Geographic',
      logo: '/logos/national-geographic.svg',
    },
    {
      name: 'National Geographic',
      logo: '/logos/national-geographic.svg',
    },
    {
      name: 'National Geographic',
      logo: '/logos/national-geographic.svg',
    },
    {
      name: 'National Geographic',
      logo: '/logos/national-geographic.svg',
    },
  ]
  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-3xl font-bold">Наші партнери</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center rounded-lg bg-gray-900 p-6"
            >
              <img src={partner.logo} alt={partner.name} className="h-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Partners
