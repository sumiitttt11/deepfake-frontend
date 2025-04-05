import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Upload, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (.jpg, .png, etc.)");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeClick = async () => {
    if (!imageFile) {
      toast.error("Please upload an image to analyze");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("https://deepfake-backend-hvcq.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setResult(data.prediction ? "Deepfake Detected" : "Authentic Image");
      toast.success(`Analysis complete! ${data.prediction ? "Deepfake detected!" : "Image is authentic."}`);
    } catch (error) {
      toast.error("Error analyzing the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section id="upload" className="py-20 min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 text-white">
            Upload Your <span className="text-neon-purple neon-glow">Image</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Drop your image below or click to upload. Our AI will analyze it and determine if it's likely to be a deepfake.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div
                className={cn(
                  "h-72 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-black/50",
                  isDragging ? "border-neon-purple animate-glow" : "border-gray-600 hover:border-neon-purple/70"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileInput} accept="image/*" />
                <Upload className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-300 text-center px-4">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-gray-500 text-sm mt-1">JPEG, PNG, or GIF (Max 10MB)</p>
              </div>
            </motion.div>

            {/* Preview Area */}
            {/* Preview Area */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="bg-black/50 rounded-lg h-72 flex items-center justify-center overflow-hidden border border-gray-800"
>
  {selectedImage ? (
    <div className="relative w-full h-full">
      <img
        src={selectedImage}
        alt="Selected image"
        className="w-full h-full object-contain p-2"
      />

      {/* Scanning Line Animation */}
      {isLoading && (
        <motion.div
          className="absolute left-0 w-full h-[2px] bg-green-400 opacity-80"
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            ease: "linear",
          }}
        />
      )}

      {/* Clear Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearImage();
        }}
        className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-gray-400 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <Image className="h-10 w-10 text-gray-500 mb-3" />
      <p className="text-gray-400">Image preview will appear here</p>
    </div>
  )}
</motion.div>

{/* Analyze Button Section */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.5 }}
  className="mt-8 flex flex-col items-center"
>
  <Button
    onClick={handleAnalyzeClick}
    disabled={!selectedImage || isLoading}
    className="bg-neon-purple hover:bg-neon-purple/80 text-white px-8 py-6 rounded-lg font-medium text-lg transition-all duration-300"
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Analyzing...
      </>
    ) : (
      "Analyze Image"
    )}
  </Button>

  {result && <p className="text-white mt-4">{result}</p>}
</motion.div>

        </div>
      </div>
    </section>
  );
};

export default UploadSection;
