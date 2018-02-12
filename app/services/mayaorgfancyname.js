import Ember from 'ember';
export default Ember.Service.extend({
    orgFancyName:null,
    init(){
        var first = [

            'Abloom',
            'Abundant',
            'Amazing',
            'Aromatic',
            'Arranged',
            'Artful',
            'Artistic',
            'Assorted',
            'Attention-getting',
            'Beautiful',
            'Blooming',
            'Blossom-filled',
            'Blossoming',
            'Blushing',
            'Bold',
            'Botanical',
            'Bountiful',
            'Breathtaking',
            'Bright',
            'Brilliant',
            'Budding',
            'Captivating',
            'Charming',
            'Cheerful',
            'Cheery',
            'Cherished',
            'Chic',
            'Choice',
            'Classic',
            'Clustered',
            'Color-Infused',
            'Colorful',
            'Combined',
            'Complementary',
            'Contemporary',
            'Country',
            'Creative',
            'Darling',
            'Dazzling',
            'Delicate',
            'Delightful',
            'Designed',
            'Distinctive',
            'Divine',
            'Dramatic',
            'Dreamy',
            'Elegant',
            'Enchanted',
            'Enchanting',
            'Exotic',
            'Expressive',
            'Exquisite',
            'Extravagant',
            'Eye-catching',
            'Fanned',
            'Farm-fresh',
            'Fashionable',
            'Festive',
            'Floral',
            'Florist-delivered',
            'Flowering',
            'Fragrant',
            'Fresh',
            'Fresh-cut',
            'Freshly picked',
            'Garden-fresh',
            'Gathered',
            'Glorious',
            'Gorgeous',
            'Graceful',
            'Hand-selected',
            'Heartfelt',
            'Heavenly',
            'Idyllic',
            'Impressive',
            'Jewel-toned',
            'Joyful',
            'Kissed',
            'Large',
            'Lasting',
            'Long-lasting',
            'Long-stem',
            'Lovely',
            'Luminous',
            'Luxurious',
            'Magical',
            'Magnificent',
            'Majestic',
            'Mesmerizing',
            'Mixed',
            'Modern',
            'Multicolored',
            'Musky',
            'Nestled',
            'One-of-a-kind',
            'Open',
            'Orchard-fresh',
            'Ornamental',
            'Oversized',
            'Pastel',
            'Personal',
            'Petite',
            'Playful',
            'Pollinated',
            'Precious',
            'Premium',
            'Pretty',
            'Pristine',
            'Prized',
            'Radiant',
            'Ravishing',
            'Ready-to-bloom',
            'Regal',
            'Rich',
            'Romantic',
            'Rustic',
            'Scented',
            'Seasonal',
            'Sensational',
            'Sentimental',
            'Showy',
            'Silky',
            'Silky-smooth',
            'Soft',
            'Sophisticated',
            'Special',
            'Spectacular',
            'Striking',
            'Stunning',
            'Styled',
            'Stylish',
            'Sublime',
            'Sun-kissed',
            'Supple',
            'Timeless',
            'Touching',
            'Traditional',
            'Treasured',
            'Tropical',
            'Unforgettable',
            'Unique',
            'Unusual',
            'Uplifting',
            'Vibrant',
            'Whimsical',
            'Wonderful',
            'Year-round',
            'Young'];


        var second = [
            'Aconitum',
            'Daisy',
            'Agapanthus',
            'Alchemilla',
            'Allium',
            'Alstroemeria',
            'Alyssum',
            'Amaranthus',
            'Amaryllis',
            'Anemone',
            'Angelonia',
            'Anthurium',
            'Aquilegia',
            'Asclepias',
            'Astilbe',
            'Astrantia',
            'Aubreita',
            'blackwell',
            'Bee-Balm',
            'Begonia',
            'Bellflower',
            'Bergenia',
            'Bluebell',
            'Bouvardia',
            'Buddleja',
            'Buttercup',
            'Calla-Lily',
            'Candytuft',
            'Canna-Lily',
            'Cape-Primrose',
            'Cardinal',
            'Carnation',
            'Celosia',
            'Clarkia',
            'Clematis',
            'Cockscomb',
            'Columbine',
            'Coneflower',
            'Coral-Bells',
            'Coreopsis',
            'Cotoneaster',
            'Crocosmia',
            'Crocus',
            'Cyclamen',
            'Daffodil',
            'Dahlia',
            'Daisy',
            'Day-Lily',
            'Delphinium',
            'Desert-Rose',
            'Dianella',
            'Dianthus',
            'Diascia',
            'Dichondra',
            'Dietes',
            'Dutch-Iris',
            'Echinacea',
            'Echium',
            'English-Bluebell',
            'Erica',
            'Erigeron',
            'Eustoma',
            'Evening-Primrose',
            'Euphorbia',
            'Flannel',
            'Flax',
            'Forget-Me-Not',
            'Forsythia',
            'Frangipani',
            'Freesia',
            'Fuschia',
            'Gaillardia',
            'Gardenia',
            'Geranium',
            'Gaura',
            'Gerbera',
            'Gladiolus',
            'Goldenrod',
            'Grape-Hyacinth',
            'Gypsophila',
            'Heather',
            'Hebe',
            'Helenium',
            'Heliotrope',
            'Hellebore',
            'Hibiscus',
            'Honesty',
            'Honeysuckle',
            'Hosta',
            'Hyacinth',
            'Hypericum',
            'Iberis',
            'Iceland-Poppy',
            'Ice-Plant',
            'Ilex',
            'Impatiens',
            'Iris',
            'Ixia',
            'Ixora',
            'Jaborosa',
            'Jasmine',
            'Jonquil',
            'Kaffir',
            'Kalmia',
            'Kangaroo',
            'Kniphofia',
            'Kolkwitzia',
            'Lantana',
            'Lavatera',
            'Lavender',
            'Lechenaultia',
            'Lilac',
            'Lily',
            'Linaria',
            'Lisianthus',
            'Lobelia',
            'Lotus',
            'Lunaria',
            'Lupin',
            'Magnolia',
            'Mallow',
            'Mandevilla',
            'Marigold',
            'Matthiola',
            'Mayflower',
            'Meconopsis',
            'Mimosa',
            'Moonflower',
            'Narcissus',
            'Nemesia',
            'Nemophila',
            'Nepeta',
            'Nerine',
            'Nicotiana',
            'Orchid',
            'Osteospermum',
            'Oyster',
            'Pansy',
            'Pelargonium',
            'Penstemon',
            'Peony',
            'Petunia',
            'Quince',
            'Rose',
            'Rudbeckia',
            'Saponaria',
            'Scabiosa',
            'Susan',
            'Scaevola',
            'Scilla',
            'Sedum',
            'Silene',
            'Snapdragon',
            'Syringa'];

        var prefix = first[Math.floor((Math.random() * (first.length-1)))];
        prefix=prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
        var sufix = second[Math.floor((Math.random() * (second.length-1)))];
        sufix=sufix.charAt(0).toUpperCase() + sufix.slice(1).toLowerCase();
        var name = prefix +'-'+sufix;
        this.set('orgFancyName',name);
    }
});