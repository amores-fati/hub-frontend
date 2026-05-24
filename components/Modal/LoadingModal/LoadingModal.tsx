import { Loading } from '@/components/base';
import { Dialog } from '@mui/material';

export default function LoadingModal({ isOpen }: { isOpen: boolean }) {
    return (
        <Dialog open={isOpen} onClose={() => {}} fullWidth maxWidth='md'>
            <Loading />
        </Dialog>
    );
}
