#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');

// OpenAI API 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 번역할 파일 목록
const filesToTranslate = [
  // Getting Started
  'packages/docs/src/content/docs/zh-cn/1_getting-started/1_introduction.mdx',
  'packages/docs/src/content/docs/zh-cn/1_getting-started/2_installation.mdx',
  'packages/docs/src/content/docs/zh-cn/1_getting-started/3_hello-world.mdx',
  'packages/docs/src/content/docs/zh-cn/1_getting-started/4_basic-elements.mdx',
  'packages/docs/src/content/docs/zh-cn/1_getting-started/5_basic-interactions.mdx',
  
  // Core Concepts
  'packages/docs/src/content/docs/zh-cn/2_core-concepts/1_declarative-rendering.mdx',
  'packages/docs/src/content/docs/zh-cn/2_core-concepts/2_widget-system.mdx',
  'packages/docs/src/content/docs/zh-cn/2_core-concepts/3_state-management.mdx',
  'packages/docs/src/content/docs/zh-cn/2_core-concepts/4_animation-basics.mdx',
  
  // Advanced Usage
  'packages/docs/src/content/docs/zh-cn/3_advanced-usage/01_what-is-render-object.mdx',
  'packages/docs/src/content/docs/zh-cn/3_advanced-usage/02_understanding-constraints-system.mdx',
  'packages/docs/src/content/docs/zh-cn/3_advanced-usage/03_building-column-from-scratch.mdx',
  'packages/docs/src/content/docs/zh-cn/3_advanced-usage/04_custom-paint-for-easy-drawing.mdx',
  
  // Examples
  'packages/docs/src/content/docs/zh-cn/4_examples/01_chart-implementation-examples.mdx',
  'packages/docs/src/content/docs/zh-cn/4_examples/02_diagram-implementation-examples.mdx',
  
  // Tutorial - Getting Started
  'packages/docs/src/content/tutorial/zh-cn/1_getting-started/3_basic-interactions.mdx',
  
  // Tutorial - Basic Widgets
  'packages/docs/src/content/tutorial/zh-cn/2_basic-widgets/001_container-styling.mdx',
  'packages/docs/src/content/tutorial/zh-cn/2_basic-widgets/002_text-styling.mdx',
  'packages/docs/src/content/tutorial/zh-cn/2_basic-widgets/003_row-column-layout.mdx',
  'packages/docs/src/content/tutorial/zh-cn/2_basic-widgets/004_stack-positioning.mdx',
  
  // Tutorial - Layout Widgets
  'packages/docs/src/content/tutorial/zh-cn/3_layout-widgets/1_expanded-flexible.mdx',
  'packages/docs/src/content/tutorial/zh-cn/3_layout-widgets/2_padding-margin.mdx',
  'packages/docs/src/content/tutorial/zh-cn/3_layout-widgets/3_sized-constrained-box.mdx',
  'packages/docs/src/content/tutorial/zh-cn/3_layout-widgets/4_align-center.mdx',
  
  // Tutorial - Interactive Widgets
  'packages/docs/src/content/tutorial/zh-cn/4_interactive-widgets/1_gesture-detector-complete.mdx',
  
  // Tutorial - Animation Widgets
  'packages/docs/src/content/tutorial/zh-cn/5_animation-widgets/001_animated-container.mdx',
  'packages/docs/src/content/tutorial/zh-cn/5_animation-widgets/002_animated-widgets-collection.mdx',
  'packages/docs/src/content/tutorial/zh-cn/5_animation-widgets/003_animation-controller.mdx',
];

// Widget 문서는 별도로 처리 (패턴이 있음)
const widgetFiles = [
  'Align', 'AnimatedAlign', 'AnimatedContainer', 'AnimatedFractionallySizedBox',
  'AnimatedOpacity', 'AnimatedPadding', 'AnimatedPositioned', 'AnimatedRotation',
  'AnimatedScale', 'AnimatedSlide', 'AspectRatio', 'Center', 'ClipOval',
  'ClipPath', 'ClipRRect', 'ClipRect', 'ColoredBox', 'Column', 'ConstrainedBox',
  'ConstraintsTransformBox', 'Container', 'CustomPaint', 'DecoratedBox',
  'Draggable', 'Expanded', 'Flex', 'Flexible', 'FractionalTranslation',
  'FractionallySizedBox', 'GestureDetector', 'Image', 'IndexedStack',
  'IntrinsicHeight', 'IntrinsicWidth', 'LimitedBox', 'Opacity', 'OverflowBox',
  'Padding', 'Positioned', 'RichText', 'Row', 'SizedBox', 'Spacer', 'Stack',
  'Text', 'Transform', 'UnconstrainedBox', 'ZIndex'
].map(widget => `packages/docs/src/content/docs/zh-cn/8_widgets/${widget}/index.mdx`);

// 번역 함수
async function translateContent(content) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional technical translator specializing in Flutter/Flitter documentation.
Translate the following English content to Simplified Chinese (zh-CN).
Keep all code blocks, technical terms, and MDX syntax exactly as they are.
Preserve all frontmatter, import statements, and component usage.
Make the translation natural and easy to understand for Chinese developers.
For UI text in code examples that are meant to be displayed (like Text widget content), translate those to Chinese as well.
Keep variable names, function names, and technical identifiers in English.`
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Translation error:', error);
    return null;
  }
}

// 파일 번역 처리
async function translateFile(filePath) {
  try {
    console.log(`Translating: ${filePath}`);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // 이미 중국어로 번역된 파일인지 확인
    if (content.includes('学习目标') || content.includes('概述') || content.includes('您的第一个')) {
      console.log(`Skipping (already translated): ${filePath}`);
      return;
    }
    
    const translatedContent = await translateContent(content);
    
    if (translatedContent) {
      await fs.writeFile(filePath, translatedContent, 'utf-8');
      console.log(`✓ Translated: ${filePath}`);
    } else {
      console.log(`✗ Failed to translate: ${filePath}`);
    }
    
    // API rate limit 방지를 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// 메인 실행 함수
async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set');
    console.log('Please set it with: export OPENAI_API_KEY="your-api-key"');
    process.exit(1);
  }

  console.log('Starting translation of zh-cn documentation files...\n');
  
  // 일반 문서 번역
  for (const file of filesToTranslate) {
    await translateFile(file);
  }
  
  // Widget 문서 번역
  console.log('\nTranslating widget documentation...');
  for (const file of widgetFiles) {
    await translateFile(file);
  }
  
  console.log('\nTranslation complete!');
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}