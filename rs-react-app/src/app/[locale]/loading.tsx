import Loader from '../../components/loader/loader';

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Loader />
    </div>
  );
}
