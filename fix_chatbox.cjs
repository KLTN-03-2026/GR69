const fs = require('fs');
let content = fs.readFileSync('src/components/chatbox/ChatBox.tsx', 'utf8');

// Find the fallback return block and replace it entirely
const startMarker = '  // Fallback cuối cùng — hỏi làm rõ thay vì báo lỗi\n  return {';
const endMarker = '  };\n}\n\n\n// =============================================\n// BUILD SYSTEM PROMPT';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1) {
  console.log('Start marker not found!');
  // Debug: show what's near line 234
  const lines = content.split('\n');
  for (let i = 230; i < 245; i++) {
    console.log(i + 1, ':', JSON.stringify(lines[i]));
  }
  process.exit(1);
}

console.log('Found at', startIdx, 'to', endIdx);

const newBlock = `  // Fallback cuối cùng — hỏi làm rõ thay vì báo lỗi\n  return {\n    text: "Tôi có thể giúp bạn tìm hiểu về:\\n\\n\u2022 \uD83D\uDC1F **Giá sản phẩm** — gõ tên hải sản bạn muốn hỏi\\n\u2022 \uD83C\uDF7D\uFE0F **Công thức nấu ăn** — gõ tên món như: tôm, cua, cá hồi\\n\u2022 \uD83D\uDE9A **Chính sách giao hàng**\\n\u2022 \uD83D\uDCDE **Liên hệ hỗ trợ**",\n    quickReplies: ["Xem sản phẩm", "Công thức nấu ăn", "Chính sách giao hàng"],\n  };\n}`;

content = content.slice(0, startIdx) + newBlock + '\n\n\n' + content.slice(endIdx + endMarker.indexOf('// ====='));

fs.writeFileSync('src/components/chatbox/ChatBox.tsx', content, 'utf8');

// Verify fix
const idx = content.indexOf('Tôi có thể giúp');
console.log('Fixed content:', JSON.stringify(content.slice(idx, idx + 200)));
