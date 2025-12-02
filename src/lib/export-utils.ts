import { ChatMessage } from './types';
import { jsPDF } from 'jspdf';

export class ExportUtils {
    static exportToMarkdown(messages: ChatMessage[], title: string): string {
        let markdown = `# ${title}\n\n`;
        markdown += `*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;

        messages.forEach((msg, index) => {
            const role = msg.role === 'user' ? '👤 User' : '🤖 Assistant';
            markdown += `## ${role}\n\n`;
            markdown += `${msg.content}\n\n`;

            if (msg.sources && msg.sources.length > 0) {
                markdown += `**Sources:**\n`;
                msg.sources.forEach(source => {
                    markdown += `- [${source.title}](${source.url})\n`;
                });
                markdown += `\n`;
            }

            markdown += `---\n\n`;
        });

        return markdown;
    }

    static exportToHTML(messages: ChatMessage[], title: string): string {
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #ddd;
        }
        .message {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .user {
            border-left: 4px solid #3b82f6;
        }
        .assistant {
            border-left: 4px solid #10b981;
        }
        .role {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .content {
            line-height: 1.6;
            color: #555;
        }
        .sources {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .sources a {
            color: #3b82f6;
            text-decoration: none;
        }
        .sources a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>Exported on ${new Date().toLocaleString()}</p>
    </div>
`;

        messages.forEach(msg => {
            const roleClass = msg.role === 'user' ? 'user' : 'assistant';
            const roleText = msg.role === 'user' ? '👤 User' : '🤖 Assistant';

            html += `    <div class="message ${roleClass}">
        <div class="role">${roleText}</div>
        <div class="content">${msg.content.replace(/\n/g, '<br>')}</div>
`;

            if (msg.sources && msg.sources.length > 0) {
                html += `        <div class="sources">
            <strong>Sources:</strong>
            <ul>
`;
                msg.sources.forEach(source => {
                    html += `                <li><a href="${source.url}" target="_blank">${source.title}</a></li>\n`;
                });
                html += `            </ul>
        </div>
`;
            }

            html += `    </div>\n`;
        });

        html += `</body>
</html>`;

        return html;
    }

    static async exportToPDF(messages: ChatMessage[], title: string): Promise<Blob> {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - 2 * margin;
        let yPosition = margin;

        // Title
        doc.setFontSize(20);
        doc.text(title, margin, yPosition);
        yPosition += 10;

        // Date
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Exported on ${new Date().toLocaleString()}`, margin, yPosition);
        yPosition += 15;

        // Messages
        doc.setTextColor(0, 0, 0);
        messages.forEach((msg, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = margin;
            }

            // Role
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            const roleText = msg.role === 'user' ? 'User' : 'Assistant';
            doc.text(roleText, margin, yPosition);
            yPosition += 7;

            // Content
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const lines = doc.splitTextToSize(msg.content, maxWidth);

            lines.forEach((line: string) => {
                if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = margin;
                }
                doc.text(line, margin, yPosition);
                yPosition += 5;
            });

            yPosition += 10;
        });

        return doc.output('blob');
    }

    static downloadFile(content: string | Blob, filename: string, type: string): void {
        const blob = typeof content === 'string'
            ? new Blob([content], { type })
            : content;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static async exportConversation(
        messages: ChatMessage[],
        title: string,
        format: 'markdown' | 'html' | 'pdf' | 'json'
    ): Promise<void> {
        const timestamp = new Date().toISOString().split('T')[0];
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        switch (format) {
            case 'markdown':
                const md = this.exportToMarkdown(messages, title);
                this.downloadFile(md, `${safeTitle}_${timestamp}.md`, 'text/markdown');
                break;

            case 'html':
                const html = this.exportToHTML(messages, title);
                this.downloadFile(html, `${safeTitle}_${timestamp}.html`, 'text/html');
                break;

            case 'pdf':
                const pdfBlob = await this.exportToPDF(messages, title);
                this.downloadFile(pdfBlob, `${safeTitle}_${timestamp}.pdf`, 'application/pdf');
                break;

            case 'json':
                const json = JSON.stringify({ title, messages, exportedAt: new Date().toISOString() }, null, 2);
                this.downloadFile(json, `${safeTitle}_${timestamp}.json`, 'application/json');
                break;
        }
    }
}
