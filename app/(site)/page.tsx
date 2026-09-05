import HomePage from '../../components/HomePage'
import { homeContentUk } from '../../content/uk/home'

export default function Page() {
  return <HomePage content={homeContentUk} locale="uk" />
}
