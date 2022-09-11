import { createRoot } from 'react-dom/client';
import StreamApp from "./StreamApp";
import '../i18n';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<StreamApp />);
