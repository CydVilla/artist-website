const YEAR = new Date().getFullYear()

export default {
  footer: (
    <small style={{ display: 'block', marginTop: '4rem' }}>
      <time>{YEAR}</time> © Art •{' '}
      <a
        href="https://landedonearth.com"
        target="_blank"
        className="text-blue-500 underline"
      >
        Ana Ion
      </a>{' '}
      <div className="text-xs">
        Images are not for personal or commercial use. If you want to use them,
        nicely ask for permission remusandreion@gmail.com{' '}
      </div>
      <style jsx>{`
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  )
}
