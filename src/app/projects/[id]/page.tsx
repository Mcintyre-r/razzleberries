export default function ProjectPage({ params }: { params: { id: string } }) {
  // ... fetch project data

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: project.title,
    description: project.description,
    image: project.thumbnail,
    offers: {
      '@type': 'Offer',
      url: project.link,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Rest of the component */}
    </>
  );
} 