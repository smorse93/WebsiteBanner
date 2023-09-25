font_large = None
font_small = None
main_text = "Steven Morse"
sub_text = "Designer - Engineer - Educator - Systems Thinker"
dot_size = 5
dots = []
spring_strength = 0.03
resting_positions = []
restore_delay = 500  # 3 seconds in milliseconds
last_interaction_time = 0  # Keep track of the last interaction time
restoring = False

# Generate tints for each letter with increasing (r, g, b) values
letter_tints = [color(i * 15, i * 15, i * 15) for i in range(len(main_text))]

def setup():
    size(1000, 600)  # Set the window size to 1000x600
    background(255)
    
    global font_large, font_small
    font_large = createFont("Helvetica", 96)  # Large font size
    font_small = createFont("Helvetica", 32)  # Small font size
    
    # Calculate text dimensions
    main_text_width = textWidth(main_text)
    main_text_height = textAscent() + textDescent()
    sub_text_width = textWidth(sub_text)
    sub_text_height = textAscent() + textDescent()
    
    # Calculate positions for the main text and sub text to center them
    main_text_x = (width - main_text_width) / 4.5
    main_text_y = (height - (main_text_height + sub_text_height + 30)) / 2  # Center vertically
    
    sub_text_x = (width - sub_text_width) / 4.5
    sub_text_y = main_text_y + main_text_height + 30  # Position below the main text with some spacing
    
    textFont(font_large)
    fill(0)
    text(main_text, main_text_x, main_text_y)
    
    textFont(font_small)
    text(sub_text, sub_text_x, sub_text_y)
    
    loadDots()

def draw():
    background(255)
    for dot in dots:
        dot.update()
        dot.display()
    
    # Check if restoring dots is required
    if not restoring:  # Check if not already restoring
        elapsed_time = millis() - last_interaction_time
        if elapsed_time > restore_delay:
            restoreDots()

class Dot:
    def __init__(self, x, y, letter_index):
        self.x = x
        self.y = y
        self.vx = 0
        self.vy = 0
        self.target_x = x
        self.target_y = y
        self.letter_index = letter_index  # Index of the letter in the text
    
    def update(self):
        self.vx += (self.target_x - self.x) * spring_strength
        self.vy += (self.target_y - self.y) * spring_strength
        self.vx *= 0.9
        self.vy *= 0.9
        self.x += self.vx
        self.y += self.vy
        
    def display(self):
        fill(letter_tints[self.letter_index])  # Set the fill color based on letter index
        noStroke()
        ellipse(self.x, self.y, dot_size, dot_size)
        
def loadDots():
    loadPixels()
    for x in range(0, width, 2):
        for y in range(0, height, 2):
            index = x + y * width
            pixel_color = pixels[index]
            if pixel_color == color(0):
                letter_index = int(map(x, 0, width, 0, len(main_text)))
                dots.append(Dot(x, y, letter_index))
                resting_positions.append((x, y))
    updatePixels()

def mouseMoved():
    global restoring, last_interaction_time
    for dot in dots:
        if dist(mouseX, mouseY, dot.x, dot.y) < 20:
            dot.target_x = random(width)
            dot.target_y = random(height)
            last_interaction_time = millis()  # Update the last interaction time
            restoring = False
    return False

def mousePressed():
    restoreDots()

def restoreDots():
    global restoring
    for i, dot in enumerate(dots):
        dot.target_x, dot.target_y = resting_positions[i]
    restoring = True
