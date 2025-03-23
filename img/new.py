from PIL import Image, ImageFilter
import math

def high_quality_resize(input_path, output_path, scale=0.05):
    # 打开图片并转换色彩模式
    img = Image.open(input_path).convert('RGB')
    
    # 分阶段缩小（可选）
    intermediate_scale = math.sqrt(scale)  # 分两次缩小
    temp_size = (
        math.floor(img.width * intermediate_scale),
        math.floor(img.height * intermediate_scale))
    img = img.resize(temp_size, Image.LANCZOS)
    
    # 最终尺寸
    final_size = (
        math.floor(img.width * intermediate_scale),
        math.floor(img.height * intermediate_scale))
    
    # 应用锐化滤镜
    #img = img.resize(final_size, Image.LANCZOS)
    #img = img.filter(ImageFilter.SHARPEN)
    
    # 高级保存参数
    img.save(
        output_path,
        quality=100,
        subsampling=0,
        dpi=(300, 300),  # 保持高DPI
        optimize=True
    )

# 使用示例
high_quality_resize("pic2.jpg", "pic2-1.jpg", 0.05)