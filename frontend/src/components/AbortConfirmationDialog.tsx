import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AbortDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const AbortConfirmationDialog = ({ open, onConfirm, onCancel }: AbortDialogProps) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-card rounded-xl p-6 shadow-xl border border-border/40 w-full max-w-sm"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Abort Generation?</h3>
                            <button onClick={onCancel}>
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-5">
                            This will immediately stop the current generation process. Are you sure you want to abort?
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    onConfirm();
                                    onCancel();
                                }}
                            >
                                Abort
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AbortConfirmationDialog;
